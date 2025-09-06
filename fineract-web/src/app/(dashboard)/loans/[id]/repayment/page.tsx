import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, DollarSignIcon } from "lucide-react"

export default function LoanRepaymentPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Loan Repayment Processing
        </h1>
        <Button>
          <DollarSignIcon className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Capture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSignIcon className="h-5 w-5 mr-2" />
              Payment Capture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Record and process loan repayments with automatic schedule updates.
            </p>
            <Button className="w-full">
              Make Payment
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Schedule Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage repayment schedules with real-time updates.
            </p>
            <Button variant="outline" className="w-full">
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
