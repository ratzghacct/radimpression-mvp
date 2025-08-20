import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"
import type { EarlyAccessUser } from "@/lib/admin-types"

interface AdminEarlyAccessTableProps {
  earlyAccessUsers: EarlyAccessUser[]
}

export function AdminEarlyAccessTable({ earlyAccessUsers }: AdminEarlyAccessTableProps) {
  if (earlyAccessUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No early access requests yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date Signed Up</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {earlyAccessUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-medium">{user.name || "Not provided"}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{user.email}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{user.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
