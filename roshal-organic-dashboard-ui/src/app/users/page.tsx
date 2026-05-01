"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileSpreadsheet, 
  FileText,
  Filter,
  MapPin,
  Phone
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const initialUsers = [
  { name: "John Doe", role: "Super Admin", email: "john@roshal.com", mobile: "01711122233", district: "Dhaka", status: "Active", avatar: "https://picsum.photos/seed/user1/100/100", joined: "Oct 2023", lastActive: "2 hours ago" },
  { name: "Jane Smith", role: "Manager", email: "jane@roshal.com", mobile: "01822334455", district: "Chittagong", status: "Active", avatar: "https://picsum.photos/seed/user2/100/100", joined: "Nov 2023", lastActive: "1 day ago" },
  { name: "Sarah Wilson", role: "Editor", email: "sarah@roshal.com", mobile: "01933445566", district: "Sylhet", status: "Inactive", avatar: "https://picsum.photos/seed/user3/100/100", joined: "Dec 2023", lastActive: "3 days ago" },
  { name: "Mike Ross", role: "Support", email: "mike@roshal.com", mobile: "01544556677", district: "Rajshahi", status: "Active", avatar: "https://picsum.photos/seed/user4/100/100", joined: "Jan 2024", lastActive: "5 mins ago" },
  { name: "Fiona Gallagher", role: "Manager", email: "fiona@roshal.com", mobile: "01655667788", district: "Dhaka", status: "Active", avatar: "https://picsum.photos/seed/user5/100/100", joined: "Feb 2024", lastActive: "1 hour ago" },
]

const districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"]

export default function UsersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [districtFilter, setDistrictFilter] = React.useState("all")

  const handleEditProfile = (userName: string) => {
    toast({
      title: "Edit Profile",
      description: `Opening profile editor for ${userName}...`,
    })
  }

  const handleDeleteMember = (userName: string) => {
    toast({
      variant: "destructive",
      title: "Member Deleted",
      description: `${userName} has been removed from the platform.`,
    })
  }

  const handleExport = (type: 'Excel' | 'PDF') => {
    toast({
      title: `Exporting to ${type}`,
      description: `Preparing ${type} file with all user records...`,
    })
  }

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50"
      case "Manager":
        return "border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50"
      case "Editor":
        return "border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50"
      case "Support":
        return "border-purple-200 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/50"
      default:
        return "border-muted text-muted-foreground bg-muted/20"
    }
  }

  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm);
    
    const matchesDistrict = districtFilter === "all" || user.district === districtFilter;
    
    return matchesSearch && matchesDistrict;
  })

  return (
    <>
      <DashboardHeader title="User Management" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or mobile..." 
                className="pl-10 border-none shadow-sm bg-card" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-none shadow-sm">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-none shadow-sm text-xs" onClick={() => handleExport('Excel')}>
              <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
              Excel
            </Button>
            <Button variant="outline" size="sm" className="bg-card border-none shadow-sm text-xs" onClick={() => handleExport('PDF')}>
              <FileText className="h-4 w-4 mr-2 text-rose-600" />
              PDF
            </Button>
            <Button className="bg-primary text-white shadow-sm" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[280px]">User Info</TableHead>
                  <TableHead>Contact & District</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.email} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-primary/10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-xs font-medium">
                            <Phone className="h-3 w-3 mr-1.5 text-muted-foreground" />
                            {user.mobile}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1.5" />
                            {user.district}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center w-fit gap-1.5 py-0.5 border shadow-none ${getRoleBadgeStyles(user.role)}`}
                        >
                          {user.role === "Super Admin" ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === "Active" ? "default" : "secondary"}
                          className={user.status === "Active" ? "bg-accent/20 text-accent-foreground border-none" : ""}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground">Joined: {user.joined}</span>
                          <span className="text-[11px] font-medium">Last active: {user.lastActive}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleEditProfile(user.name)}
                            title="Edit Profile"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteMember(user.name)}
                            title="Delete Member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Management</DropdownMenuLabel>
                              <DropdownMenuItem className="gap-2" onClick={() => handleEditProfile(user.name)}>
                                <Shield className="h-4 w-4" /> Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteMember(user.name)}>
                                <Trash2 className="h-4 w-4" /> Suspend Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No users found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
