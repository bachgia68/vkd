import { useLoyaltyData } from '../hooks/useLoyaltyData';

export function LoyaltyDebug() {
  const { data, loading, error } = useLoyaltyData('test@example.com');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.customer) return <div>No customer found</div>;

  return (
    <div>
      <h3>{data.customer.fullName}</h3>
      <p>Points: {data.totalPoints}</p>
      <p>Orders: {data.orders.length}</p>
    </div>
  );
}
