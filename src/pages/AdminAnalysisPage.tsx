import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { analyticsAPI } from '@/services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

const AdminAnalysisPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getDaily(startDate, endDate);
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics();
  };

  if (loading) return <LoadingSpinner />;

  // If no data at all, show empty state
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No data available for the selected period.</p>
      </div>
    );
  }

  // Destructure with safe defaults
  const {
    daily = [],
    popularItems = [],
    paymentMethods = [],
    totals = { totalOrders: 0, totalRevenue: 0 },
    period,
  } = data;

  // Prepare payment methods for pie chart
  const paymentData = paymentMethods.map((pm: any) => ({
    name:
      pm._id === 'cash'
        ? 'Cash on Delivery'
        : pm._id === 'paytm'
        ? 'Paytm'
        : pm._id === 'gpay'
        ? 'Google Pay'
        : pm._id === 'phonepe'
        ? 'PhonePe'
        : pm._id || 'Other',
    value: pm.count || 0,
  }));

  // Prepare popular items for bar chart
  const popularData = popularItems.map((item: any) => ({
    name: item.name?.length > 15 ? item.name.substring(0, 12) + '...' : item.name || 'Unknown',
    quantity: item.quantity || 0,
  }));

  // Calculate average order value
  const avgOrderValue =
    totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0;

  // Determine trend (optional – you can implement real trend if your API provides it)
  const revenueTrend = daily.length >= 2 ? (
    daily[daily.length - 1].revenue > daily[0].revenue ? 'up' : 'down'
  ) : 'neutral';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">
        Daily Analysis
      </h1>

      {/* Date Range Picker */}
      <form
        onSubmit={handleApply}
        className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4"
      >
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Calendar className="h-4 w-4" /> Apply
        </button>
      </form>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-foreground">{totals.totalOrders}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              {period && (
                <span>
                  {format(new Date(period.start), 'MMM d')} -{' '}
                  {format(new Date(period.end), 'MMM d')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totals.totalRevenue || 0)}
            </p>
            {revenueTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
            {revenueTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
            {revenueTrend === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatCurrency(avgOrderValue)}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Daily Revenue Chart */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Daily Revenue
          </h2>
          {daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-muted-foreground">No revenue data</p>
          )}
        </div>

        {/* Daily Orders Chart */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Daily Orders
          </h2>
          {daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-muted-foreground">No orders data</p>
          )}
        </div>

        {/* Top 5 Items */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Top 5 Items
          </h2>
          {popularData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip
                  formatter={(value: number) => [`${value} sold`, 'Quantity']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-muted-foreground">No popular items data</p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Payment Methods
          </h2>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} orders`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-muted-foreground">No payment data</p>
          )}
        </div>
      </div>

      {/* Daily Breakdown Table */}
      {daily.length > 0 && (
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Daily Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Orders</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {daily.map((day: any) => (
                  <tr key={day._id}>
                    <td className="px-4 py-2 text-foreground">
                      {format(new Date(day._id), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-2 text-foreground">{day.orders}</td>
                    <td className="px-4 py-2 text-foreground">{formatCurrency(day.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalysisPage;