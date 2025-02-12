import type { PaymentType } from '@/types/paymentTypes';
export const db: PaymentType[] = [
  {
    id: 1,
    date: '2023-01-01',
    method: 'Paypal',
    address: 'example@gmail.com',
    amount: 100,
    country: 'India',
    client: 'Client',
    status: 'Success',
    action: false,
    description: 'Description',
    io: 'In'
  },
  {
    id: 2,
    date: '2023-01-01',
    method: 'Paypal',
    address: 'example@gmail.com',
    amount: 100,
    country: 'India',
    client: 'Client',
    status: 'Pending',
    action: true,
    description: 'Description',
    io: 'In'
  },
  {
    id: 3,
    date: '2023-01-01',
    method: 'Paypal',
    address: 'example@gmail.com',
    amount: 100,
    country: 'India',
    client: 'Client',
    status: 'Success',
    action: false,
    description: 'Description',
    io: 'In'
  },
  {
    id: 4,
    date: '2023-01-01',
    method: 'Paypal',
    address: 'example@gmail.com',
    amount: 100,
    country: 'India',
    client: 'Client',
    status: 'Success',
    action: false,
    description: 'Description',
    io: 'In'
  }
];
