// Demo data for testing without Supabase
export const demoUsers = [
  {
    id: 'demo-1',
    username: '99000000',
    phone: '99000000',
    password: 'super123',
    role: 'super_admin' as const,
    name: 'Супер Админ',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-2',
    username: '99000001',
    phone: '99000001',
    password: 'admin123',
    role: 'admin' as const,
    name: 'Админ Дорж',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-3',
    username: '99000002',
    phone: '99000002',
    password: 'operator123',
    role: 'operator' as const,
    name: 'Оператор Болд',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-4',
    username: '99112233',
    phone: '99112233',
    password: 'driver123',
    role: 'driver' as const,
    name: 'Жолооч Бат',
    driverName: 'Бат',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-5',
    username: '99112234',
    phone: '99112234',
    password: 'lead123',
    role: 'driver_lead' as const,
    name: 'Ахлагч Цэрэн',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-6',
    username: '99112235',
    phone: '99112235',
    password: 'account123',
    role: 'accounting' as const,
    name: 'Нягтлан Сара',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-7',
    username: '99112236',
    phone: '99112236',
    password: 'warehouse123',
    role: 'warehouse' as const,
    name: 'Агуулах Ганбат',
    started: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const demoProducts = [
  { id: 1, code: 'PRD001', name: 'Сүү 1л', size: '1л', color: 'Цагаан', price: 3500, description: 'Эрүүл мэндийн сүү', stock: 150 },
  { id: 2, code: 'PRD002', name: 'Талх', size: '500г', color: 'Бор', price: 2000, description: 'Шинэ талх', stock: 200 },
  { id: 3, code: 'PRD003', name: 'Төмс', size: '1кг', color: 'Шар', price: 1500, description: 'Шинэ төмс', stock: 300 },
  { id: 4, code: 'PRD004', name: 'Лууван', size: '1кг', color: 'Улаан', price: 2500, description: 'Шинэ лууван', stock: 100 },
  { id: 5, code: 'PRD005', name: 'Сонгино', size: '1кг', color: 'Улаан', price: 1800, description: 'Шинэ сонгино', stock: 150 },
  { id: 6, code: 'PRD006', name: 'Өндөг', size: '30ш', color: 'Цагаан', price: 12000, description: 'Шинэ өндөг', stock: 80 },
  { id: 7, code: 'PRD007', name: 'Гурил', size: '1кг', color: 'Цагаан', price: 2200, description: 'Цагаан гурил', stock: 250 },
  { id: 8, code: 'PRD008', name: 'Будаа', size: '1кг', color: 'Цагаан', price: 3000, description: 'Чанартай будаа', stock: 180 },
  { id: 9, code: 'PRD009', name: 'Элсэн чихэр', size: '1кг', color: 'Цагаан', price: 2800, description: 'Элсэн чихэр', stock: 120 },
  { id: 10, code: 'PRD010', name: 'Тос', size: '1л', color: 'Шар', price: 8500, description: 'Ургамлын тос', stock: 90 }
];

export const demoOrders = [
  {
    id: 1,
    orderNumber: 1001,
    opp: '001',
    customerName: 'Бат',
    customerPhone: '99001111',
    orderTotal: 25000,
    status: 'NEW',
    payment_state: 'NOT_PAID',
    payment_method: null,
    prepaid: false,
    address: 'СБД 1-р хороо, Барилга 123',
    district: 'Сүхбаатар',
    province: 'Улаанбаатар',
    driver: null,
    operator_note: '',
    customOrder: '',
    products: [
      { name: 'Сүү 1л', quantity: 2, price: 3500 },
      { name: 'Талх', quantity: 3, price: 2000 }
    ],
    history: [],
    created_at: new Date().toISOString(),
    assignedDate: null
  },
  {
    id: 2,
    orderNumber: 1002,
    opp: '002',
    customerName: 'Дорж',
    customerPhone: '99002222',
    orderTotal: 45000,
    status: 'IN_TRANSIT',
    payment_state: 'PAID',
    payment_method: 'bank',
    prepaid: true,
    address: 'ХУД 3-р хороо, Барилга 456',
    district: 'Хан-Уул',
    province: 'Улаанбаатар',
    driver: 'Бат',
    operator_note: '',
    customOrder: '1',
    products: [
      { name: 'Өндөг', quantity: 2, price: 12000 },
      { name: 'Тос', quantity: 1, price: 8500 }
    ],
    history: [
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'Захиалга үүсгэгдсэн',
        user: 'Оператор Болд',
        note: 'Шинэ захиалга'
      },
      {
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        action: 'Захиалга жолоочид хуваарилагдсан',
        user: 'Бат',
        note: 'Жолоочид хуваарилагдсан'
      }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    assignedDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 3,
    orderNumber: 1003,
    opp: '003',
    customerName: 'Сара',
    customerPhone: '99003333',
    orderTotal: 15000,
    status: 'DELIVERED',
    payment_state: 'PAID',
    payment_method: 'cash',
    prepaid: false,
    address: 'БЗД 5-р хороо, Барилга 789',
    district: 'Баянзүрх',
    province: 'Улаанбаатар',
    driver: 'Бат',
    operator_note: '',
    customOrder: '2',
    products: [
      { name: 'Төмс', quantity: 5, price: 1500 },
      { name: 'Лууван', quantity: 3, price: 2500 }
    ],
    history: [
      {
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        action: 'Захиалга үүсгэгдсэн',
        user: 'Оператор Болд',
        note: 'Шинэ захиалга'
      },
      {
        timestamp: new Date(Date.now() - 90000000).toISOString(),
        action: 'DELIVERED',
        user: 'Бат',
        note: 'Амжилттай хүргэгдсэн'
      }
    ],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    assignedDate: new Date(Date.now() - 172800000).toISOString().split('T')[0]
  }
];

export const demoDriverLeads = [
  {
    id: 1,
    name: 'Жолооч Дорж',
    phone: '99887766',
    district: 'СБД',
    province: 'Улаанбаатар',
    note: 'Toyota Prius - 5 жилийн туршлагатай',
    status: 'OPEN',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Жолооч Бат',
    phone: '99776655',
    district: 'ХУД',
    province: 'Улаанбаатар',
    note: 'Nissan Leaf - Цахилгаан машин',
    status: 'CONTACTED',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const demoStocks = [
  { id: 1, product_code: 'PRD001', qty: 150, warehouse: 'Төв агуулах' },
  { id: 2, product_code: 'PRD002', qty: 200, warehouse: 'Төв агуулах' },
  { id: 3, product_code: 'PRD003', qty: 300, warehouse: 'Төв агуулах' },
  { id: 4, product_code: 'PRD004', qty: 100, warehouse: 'Төв агуулах' },
  { id: 5, product_code: 'PRD005', qty: 150, warehouse: 'Төв агуулах' }
];