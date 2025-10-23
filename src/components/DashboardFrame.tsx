import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Calendar } from "lucide-react";
import { useAppContext } from "../App";
import { getDateByOffset } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formatMNT = (amount: number) => {
  return `${amount.toLocaleString()}₮`;
};

// Utility: Get date key from date string
const getDateKey = (dateStr: string | undefined): "today" | "yesterday" | "dayBefore" => {
  if (!dateStr) return "today";
  
  try {
    const orderDate = new Date(dateStr).toISOString().split('T')[0];
    const today = getDateByOffset(0);
    const yesterday = getDateByOffset(-1);
    const dayBefore = getDateByOffset(-2);
    
    if (orderDate === today) return "today";
    if (orderDate === yesterday) return "yesterday";
    if (orderDate === dayBefore) return "dayBefore";
    return "today";
  } catch (error) {
    return "today";
  }
};

export function DashboardFrame() {
  const { selectedDate, setSelectedDate, orders, getCurrentMongolianDate } = useAppContext();

  const currentDate = getCurrentMongolianDate(); // Get current Mongolian date

  // Filter orders by selected date
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Use history timestamp if available, otherwise default to today
      const orderDate = order.history?.[0]?.timestamp;
      return getDateKey(orderDate) === selectedDate;
    });
  }, [orders, selectedDate]);

  // Calculate KPIs dynamically
  const kpi = useMemo(() => {
    const todayTotal = filteredOrders.length;
    const delivered = filteredOrders.filter(o => o.status === "DELIVERED").length;
    const returned = filteredOrders.filter(o => o.status === "RETURNED").length;
    const successRate = todayTotal > 0 ? (delivered / todayTotal) * 100 : 0;
    const returnRate = todayTotal > 0 ? (returned / todayTotal) * 100 : 0;

    // Revenue calculations
    const totalRevenue = filteredOrders.reduce((sum, o) => {
      if (o.status === "DELIVERED" || o.status === "RETURNED") {
        return sum + (o.orderTotal - o.goodsReturned);
      }
      return sum;
    }, 0);

    const returnAmount = filteredOrders.reduce((sum, o) => sum + (o.goodsReturned || 0), 0);
    
    const driverSalary = filteredOrders.reduce((sum, o) => sum + (o.driverSalary || 0), 0);

    const netRevenue = totalRevenue - driverSalary - returnAmount;

    return {
      todayTotal,
      successfulDelivery: delivered,
      successRate,
      returns: returned,
      returnRate,
      netRevenue,
      totalRevenue,
      driverSalary,
      returnAmount
    };
  }, [filteredOrders]);

  // Calculate OPP target (example: target 200 orders)
  const oppTarget = useMemo(() => {
    const target = 200;
    const current = filteredOrders.length;
    const percentage = (current / target) * 100;
    return { target, current, percentage };
  }, [filteredOrders]);

  // Calculate 3-day goods outflow by PRODUCT NAME (not OPP)
  const goodsOutflow = useMemo(() => {
    // Group orders by product name and date
    const productStats = new Map<string, { today: number; yesterday: number; dayBefore: number }>();

    orders.forEach(order => {
      // Only count DELIVERED orders (not RETURNED/CANCELLED)
      if (order.status !== "RETURNED" && order.status !== "CANCELLED") {
        const orderDate = order.history?.[0]?.timestamp;
        const dateKey = getDateKey(orderDate);
        
        // Extract products from order
        if (order.products && order.products.length > 0) {
          order.products.forEach((product: any) => {
            const productName = product.name;
            
            if (!productStats.has(productName)) {
              productStats.set(productName, { today: 0, yesterday: 0, dayBefore: 0 });
            }
            
            const stats = productStats.get(productName)!;
            stats[dateKey] += product.quantity || 1;
          });
        }
      }
    });

    // Convert to array and calculate color based on threshold (5+)
    return Array.from(productStats.entries())
      .map(([productName, stats]) => ({
        productName,
        today: stats.today,
        yesterday: stats.yesterday,
        dayBefore: stats.dayBefore,
        color: stats.today >= 5 ? "green" : "red" // 5+ = green, <5 = red
      }))
      .sort((a, b) => b.today - a.today); // Sort by today's count
  }, [orders]);

  // Calculate return statistics - RETURNED/CANCELLED products (no limit)
  const returnOutflow = useMemo(() => {
    // Track returned products by name and date
    const productReturns = new Map<string, { today: number; yesterday: number; dayBefore: number; name: string }>();

    orders.forEach(order => {
      if (order.status === "RETURNED" || order.status === "CANCELLED") {
        const orderDate = order.history?.[0]?.timestamp;
        const dateKey = getDateKey(orderDate);
        
        // If order has products, track each product
        if (order.products && order.products.length > 0) {
          order.products.forEach((product: any) => {
            const productName = product.name;
            
            if (!productReturns.has(productName)) {
              productReturns.set(productName, { today: 0, yesterday: 0, dayBefore: 0, name: productName });
            }
            
            const stats = productReturns.get(productName)!;
            stats[dateKey] += product.quantity || 1;
          });
        } else {
          // If no products, use order number as placeholder
          const productKey = `Захиалга #${order.orderNumber}`;
          
          if (!productReturns.has(productKey)) {
            productReturns.set(productKey, { today: 0, yesterday: 0, dayBefore: 0, name: productKey });
          }
          
          const stats = productReturns.get(productKey)!;
          stats[dateKey] += 1;
        }
      }
    });

    // Convert to array - NO LIMIT (show all returned products)
    const allReturns = Array.from(productReturns.values())
      .sort((a, b) => (b.today + b.yesterday + b.dayBefore) - (a.today + a.yesterday + a.dayBefore));

    // Group by date for display
    return {
      today: allReturns.filter(p => p.today > 0).sort((a, b) => b.today - a.today),
      yesterday: allReturns.filter(p => p.yesterday > 0).sort((a, b) => b.yesterday - a.yesterday),
      dayBefore: allReturns.filter(p => p.dayBefore > 0).sort((a, b) => b.dayBefore - a.dayBefore),
      total: allReturns.reduce((sum, p) => sum + p.today + p.yesterday + p.dayBefore, 0)
    };
  }, [orders]);

  // Calculate driver stats
  const driverStats = useMemo(() => {
    const driverMap = new Map<string, { delivered: number; total: number; revenue: number }>();
    
    filteredOrders.forEach(order => {
      if (order.driver) {
        const existing = driverMap.get(order.driver) || { delivered: 0, total: 0, revenue: 0 };
        existing.total += 1;
        if (order.status === "DELIVERED") {
          existing.delivered += 1;
          existing.revenue += (order.orderTotal - order.goodsReturned);
        }
        driverMap.set(order.driver, existing);
      }
    });

    return Array.from(driverMap.entries()).map(([name, stats]) => ({
      name,
      percentage: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
      delivered: stats.delivered,
      total: stats.total,
      revenue: stats.revenue
    }));
  }, [filteredOrders]);

  // Calculate district/province distribution
  const regionStats = useMemo(() => {
    const districtMap = new Map<string, { today: number; yesterday: number; dayBefore: number }>();
    const provinceMap = new Map<string, { today: number; yesterday: number; dayBefore: number }>();

    orders.forEach(order => {
      const orderDate = order.history?.[0]?.timestamp;
      const dateKey = getDateKey(orderDate);
      
      if (order.district) {
        const existing = districtMap.get(order.district) || { today: 0, yesterday: 0, dayBefore: 0 };
        existing[dateKey] = (existing[dateKey] || 0) + 1;
        districtMap.set(order.district, existing);
      }
      
      if (order.province) {
        const existing = provinceMap.get(order.province) || { today: 0, yesterday: 0, dayBefore: 0 };
        existing[dateKey] = (existing[dateKey] || 0) + 1;
        provinceMap.set(order.province, existing);
      }
    });

    return {
      districts: Array.from(districtMap.entries()).map(([name, counts]) => ({
        name,
        today: counts.today || 0,
        yesterday: counts.yesterday || 0,
        dayBefore: counts.dayBefore || 0
      })),
      provinces: Array.from(provinceMap.entries()).map(([name, counts]) => ({
        name,
        today: counts.today || 0,
        yesterday: counts.yesterday || 0,
        dayBefore: counts.dayBefore || 0
      }))
    };
  }, [orders]);

  const dateLabel = selectedDate === "today" ? "Өнөөдөр" : selectedDate === "yesterday" ? "Өчигдөр" : "Уржигдар";

  return (
    <div className="space-y-6">
      {/* Header with Date Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl">Dashboard — {currentDate}</h1>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={selectedDate === "today" ? "default" : "outline"}
              onClick={() => setSelectedDate("today")}
              className={selectedDate === "today" ? "bg-blue-600" : ""}
            >
              Өнөөдөр
            </Button>
            <Button size="sm" variant="outline">7 хоног</Button>
            <Button size="sm" variant="outline">30 хоог</Button>
            <Button 
              size="sm" 
              variant={selectedDate === "yesterday" ? "default" : "outline"}
              onClick={() => setSelectedDate("yesterday")}
            >
              Өчигдөр
            </Button>
            <Button 
              size="sm" 
              variant={selectedDate === "dayBefore" ? "default" : "outline"}
              onClick={() => setSelectedDate("dayBefore")}
            >
              Уржигдар
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" defaultValue="2025-10-21" className="w-40" />
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Өнөөдрийн нийт захиалга</div>
            <div className="text-3xl">{kpi.todayTotal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Амжилттай хүргэлт</div>
            <div className="text-3xl text-green-600">{kpi.successfulDelivery}</div>
            <div className="text-xs text-gray-500 mt-1">
              {kpi.successRate.toFixed(1)}% • амжилттай
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Буцаалт</div>
            <div className="text-3xl text-red-600">{kpi.returns}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.returnRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Цэвэр орлого</div>
            <div className="text-3xl text-blue-600">{formatMNT(kpi.netRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Хүргэлтийн чиг хандлага</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <ArrowUp className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Орлогын нэгдэл */}
      <div>
        <h3 className="text-sm text-gray-700 mb-3">Орогын нэгдэл</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 border border-blue-200 p-4 rounded-lg">
            <div className="text-sm text-blue-900 mb-1">нийт орлого: {formatMNT(kpi.totalRevenue)}</div>
          </div>
          <div className="bg-yellow-100 border border-yellow-200 p-4 rounded-lg">
            <div className="text-sm text-yellow-900 mb-1">жолоочийн нийт цалин: {formatMNT(kpi.driverSalary)}</div>
          </div>
          <div className="bg-red-100 border border-red-200 p-4 rounded-lg">
            <div className="text-sm text-red-900 mb-1">буцаалт: {formatMNT(kpi.returnAmount)}</div>
          </div>
        </div>
      </div>

      {/* 3-Day Goods & Returns Outflow - Барааны гарц болон Буцаалтын гарц */}
      <div className="grid grid-cols-2 gap-4">
        {/* Барааны гарц (ОПП-ээр) */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны гарц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 pb-2 border-b">
                <div></div>
                <div className="text-center">Өнөөдөр</div>
                <div className="text-center">Өчигдөр</div>
                <div className="text-center">Уржигдар</div>
              </div>
              
              {/* OPP rows */}
              {goodsOutflow.map((opp, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-sm">{opp.productName}</div>
                  <div className="text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                      opp.color === "green" ? "bg-green-500 text-white" : 
                      "bg-red-500 text-white"
                    }`}>
                      {opp.today}
                      {opp.color === "green" && " ▲"}
                      {opp.color === "red" && " ▼"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-2 py-1 rounded text-sm bg-green-500 text-white">
                      {opp.yesterday}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-2 py-1 rounded text-sm bg-green-500 text-white">
                      {opp.dayBefore}
                    </span>
                  </div>
                </div>
              ))}
              
              {goodsOutflow.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">Мэдээлэл алга</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Буцаалт өндөртэй бараа (Top 50) */}
        <Card>
          <CardHeader>
            <CardTitle>Буцаалт өндөртэй бараа (Top 50)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Өнөөдөр */}
              {returnOutflow.today.length > 0 && (
                <div>
                  <div className="text-xs text-gray-600 mb-2">Өнөөдөр</div>
                  <div className="space-y-1">
                    {returnOutflow.today.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="text-red-600">{product.today}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Өчигдөр */}
              {returnOutflow.yesterday.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600 mb-2">Өчигдөр</div>
                  <div className="space-y-1">
                    {returnOutflow.yesterday.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="text-red-600">{product.yesterday}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Уржигдар */}
              {returnOutflow.dayBefore.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600 mb-2">Уржигдар</div>
                  <div className="space-y-1">
                    {returnOutflow.dayBefore.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="text-red-600">{product.dayBefore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {returnOutflow.total === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">Буцаалт алга</div>
              )}

              {returnOutflow.total > 0 && (
                <div className="pt-3 border-t text-xs text-gray-500">
                  RETURNED/CANCELLED өөрөөр группласан
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom 2-column section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Жолоочдын гүйцэтгэл % */}
        <Card>
          <CardHeader>
            <CardTitle>Жолоочдын гүйцэтгэл %</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {driverStats.length > 0 ? (
              <>
                {driverStats.map((driver, idx) => (
                  <div key={idx} className="text-sm">
                    <div>{driver.name} → {driver.percentage.toFixed(1)}% / {driver.delivered} — {formatMNT(driver.revenue)}</div>
                  </div>
                ))}
                <div className="pt-3 border-t text-sm">
                  <div>Нийт дүн: {formatMNT(driverStats.reduce((sum, d) => sum + d.revenue, 0))}</div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">Жолооч томилогдоогүй байна</div>
            )}
          </CardContent>
        </Card>

        {/* ОПП зорилт / авч % */}
        <Card>
          <CardHeader>
            <CardTitle>ОПП зорилт / авч %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Зорилт {oppTarget.target} / одоогийн {oppTarget.current} / {oppTarget.percentage.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(oppTarget.percentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District & Province Maps */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Дүүргүүд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {regionStats.districts.length > 0 ? (
                regionStats.districts.map((district, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer text-sm group"
                    title={`Өнөөдөр: ${district.today}, Өчигдөр: ${district.yesterday}, Уржигдар: ${district.dayBefore}`}
                  >
                    <span>{district.name}</span>
                    <span className="text-gray-600 group-hover:text-blue-600">{district.today}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">Дүүрэг олдсонгүй</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Аймгууд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {regionStats.provinces.length > 0 ? (
                regionStats.provinces.map((province, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer text-sm group"
                    title={`Өнөөдөр: ${province.today}, Өчигдөр: ${province.yesterday}, Уржигдар: ${province.dayBefore}`}
                  >
                    <span>{province.name}</span>
                    <span className="text-gray-600 group-hover:text-blue-600">{province.today}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">Аймаг олдсонгүй</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logic annotation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="text-xs text-gray-700 space-y-1">
            <div><strong>🔄 REAL-TIME тооцоо үгик (mock өгөгдөл биш!):</strong></div>
            <div>• KPI = өдөр бүрийн захиалгаас автомат тооцоолно</div>
            <div>• Орлого = orderTotal - goodsReturned - driverSalary</div>
            <div>• Дүүрэг/Аймаг = district/province-оор ангилна</div>
            <div>• Date tab дарахад бүх дэлгэц шинэчлэгдэнэ!</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}