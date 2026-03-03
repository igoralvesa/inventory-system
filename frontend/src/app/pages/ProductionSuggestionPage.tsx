import { useQuery } from '@tanstack/react-query';
import { suggestionApi } from '../api/suggestion';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '../components/ui/table';
import { RefreshCw } from 'lucide-react';

export function ProductionSuggestionPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['production-suggestion'],
    queryFn: suggestionApi.get,
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Production Suggestion</h1>
        <Button onClick={handleRefresh} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.suggestedProduction.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Total Revenue
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  ${data.totalRevenue.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {data.suggestedProduction.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No production suggestions available. Make sure you have products with materials and sufficient stock.
            </div>
          )}
        </>
      )}
    </div>
  );
}
