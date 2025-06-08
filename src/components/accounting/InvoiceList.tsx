import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  List,
  Grid2X2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InvoiceViewDialog } from '@/components/invoices/InvoiceViewDialog';
import { InvoiceData } from '@/utils/invoiceUtils';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface InvoiceListProps {
  data: {
    invoices: InvoiceData[];
  };
  onView: (invoice: InvoiceData) => void;
  onEdit: (invoice: InvoiceData) => void;
  onDownload: (invoice: InvoiceData) => void;
  onPay: (invoice: InvoiceData) => void;
  onSendReminder: (invoice: InvoiceData) => void;
  isAdmin?: boolean;
}

export function InvoiceList({ 
  data, 
  onView, 
  onEdit, 
  onDownload, 
  onPay, 
  onSendReminder,
  isAdmin = false
}: InvoiceListProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewInvoiceDialogOpen, setViewInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const filteredInvoices = activeTab === 'all' 
    ? data.invoices 
    : data.invoices.filter(invoice => invoice.status === activeTab);

  const filterOptions = [
    { 
      key: 'all', 
      label: 'All Invoices', 
      count: data.invoices.length,
      icon: FileText
    },
    { 
      key: 'pending', 
      label: 'Pending', 
      count: data.invoices.filter(i => i.status === 'pending').length,
      icon: Clock
    },
    { 
      key: 'paid', 
      label: 'Paid', 
      count: data.invoices.filter(i => i.status === 'paid').length,
      icon: CheckCircle
    },
    { 
      key: 'overdue', 
      label: 'Overdue', 
      count: data.invoices.filter(i => i.status === 'overdue').length,
      icon: AlertCircle
    },
  ];

  const handleViewInvoice = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setViewInvoiceDialogOpen(true);
    onView(invoice);
  };

  const handleFilterClick = (filterKey: string) => {
    setActiveTab(filterKey as any);
    if (isMobile) {
      // Toggle expanded state - don't auto-collapse
      if (expandedFilter === filterKey) {
        setExpandedFilter(null);
      } else {
        setExpandedFilter(filterKey);
      }
    }
  };

  const handleDownloadInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice #${invoice.number} has been downloaded.`
    });
    onDownload(invoice);
  };

  const handleSendInvoice = (invoice: InvoiceData) => {
    if (!isAdmin) return;
    toast({
      title: "Invoice sent",
      description: `Invoice #${invoice.number} has been sent to ${invoice.client}.`
    });
  };

  const handlePrintInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Printing invoice",
      description: `Invoice #${invoice.number} sent to printer.`
    });
  };

  const handleEditInvoice = (invoice: InvoiceData) => {
    if (!isAdmin) return;
    toast({
      title: "Edit invoice",
      description: `Edit mode for invoice #${invoice.number}.`
    });
    onEdit(invoice);
  };

  const handleDeleteInvoice = (invoice: InvoiceData) => {
    if (!isAdmin) return;
    toast({
      title: "Invoice deleted",
      description: `Invoice #${invoice.number} has been deleted.`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="w-full">
      <Card className="mb-6">
        {/* Mobile Horizontal Scrollable Navigation */}
        {isMobile ? (
          <div className="p-4 border-b">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {/* Filter Options */}
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = activeTab === option.key;
                  const isExpanded = expandedFilter === option.key;
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => handleFilterClick(option.key)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 whitespace-nowrap",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80",
                        isExpanded ? "px-6" : ""
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      
                      {/* Count badge */}
                      {option.count > 0 && (
                        <div className={cn(
                          "flex items-center justify-center min-w-[20px] h-5 rounded-full text-xs font-semibold",
                          isActive 
                            ? "bg-primary-foreground text-primary" 
                            : "bg-primary text-primary-foreground"
                        )}>
                          {option.count}
                        </div>
                      )}
                      
                      {/* Expanded text */}
                      <span 
                        className={cn(
                          "text-sm font-medium transition-all duration-300 overflow-hidden",
                          isExpanded ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"
                        )}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
                
                {/* View Mode Toggle Buttons */}
                <div className="flex gap-1 ml-2 border-l border-border pl-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-full transition-all duration-300",
                      viewMode === 'list'
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-full transition-all duration-300",
                      viewMode === 'grid'
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <Grid2X2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop Tab Navigation (unchanged)
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex gap-1">
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={activeTab === option.key ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setActiveTab(option.key as any)}
                >
                  {option.label}
                  <Badge variant="secondary" className={activeTab === option.key ? "bg-white/20" : ""}>
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List View
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </Button>
            </div>
          </div>
        )}

        <div>
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-1 px-2 text-left">Invoice #</th>
                    <th className="py-1 px-2 text-left">Client</th>
                    <th className="py-1 px-2 text-left">Status</th>
                    <th className="py-1 px-2 text-left">Amount</th>
                    <th className="py-1 px-2 text-left">Date</th>
                    <th className="py-1 px-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/30 transition">
                      <td className="py-1 px-2 font-medium text-xs">#{invoice.number}</td>
                      <td className="py-1 px-2 text-xs">{invoice.client}</td>
                      <td className="py-1 px-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                      </td>
                      <td className="py-1 px-2 text-xs">${invoice.amount}</td>
                      <td className="py-1 px-2 text-xs">{format(new Date(invoice.date), 'MMM d, yyyy')}</td>
                      <td className="py-1 px-2">
                        <div className="flex flex-wrap gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewInvoice(invoice)} 
                            className="px-3 py-1 text-xs"
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownloadInvoice(invoice)} 
                            className="px-3 py-1 text-xs"
                          >
                            Download
                          </Button>
                          {isAdmin && (invoice.status === "pending" || invoice.status === "overdue") && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => onPay(invoice)}
                              className="!px-3 py-1 text-xs"
                            >
                              Mark Paid
                            </Button>
                          )}
                          {isAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditInvoice(invoice)} 
                              className="px-3 py-1 text-xs"
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-muted-foreground text-sm">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-320px)] sm:h-[calc(100vh-280px)]">
              <div className="space-y-3 p-3">
                {filteredInvoices.map((invoice) => (
                  <InvoiceItem 
                    key={invoice.id} 
                    invoice={invoice}
                    onView={handleViewInvoice}
                    onDownload={handleDownloadInvoice}
                    onSend={handleSendInvoice}
                    onPrint={handlePrintInvoice}
                    onEdit={handleEditInvoice}
                    onDelete={handleDeleteInvoice}
                    getStatusColor={getStatusColor}
                    onPay={onPay}
                    isAdmin={isAdmin}
                  />
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">No invoices found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </Card>
      
      {selectedInvoice && (
        <InvoiceViewDialog
          isOpen={viewInvoiceDialogOpen}
          onClose={() => setViewInvoiceDialogOpen(false)}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}

interface InvoiceItemProps {
  invoice: InvoiceData;
  onView: (invoice: InvoiceData) => void;
  onDownload: (invoice: InvoiceData) => void;
  onSend: (invoice: InvoiceData) => void;
  onPrint: (invoice: InvoiceData) => void;
  onEdit: (invoice: InvoiceData) => void;
  onDelete: (invoice: InvoiceData) => void;
  getStatusColor: (status: string) => string;
  onPay: (invoice: InvoiceData) => void;
  isAdmin?: boolean;
}

function InvoiceItem({ 
  invoice, 
  onView, 
  onDownload, 
  onSend, 
  onPrint, 
  onEdit, 
  onDelete, 
  getStatusColor, 
  onPay,
  isAdmin = false,
}: InvoiceItemProps) {
  const showMarkAsPaid = isAdmin && (invoice.status === 'pending' || invoice.status === 'overdue');
  
  return (
    <div className="flex flex-col bg-card rounded-lg shadow-sm">
      <div className="p-3 flex-row justify-between items-center border-b border-border hidden sm:flex">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-medium text-sm">Invoice #{invoice.number}</h3>
            <div className="text-xs text-muted-foreground truncate max-w-xs">{invoice.client}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          <div className="text-right">
            <div className="font-medium">${invoice.amount}</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{format(new Date(invoice.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 flex-row justify-between items-center border-b border-border flex sm:hidden">
        <div className="space-y-1">
          <h3 className="font-medium text-sm">Invoice #{invoice.number}</h3>
          <div className="text-xs text-muted-foreground truncate max-w-xs">{invoice.client}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            <div className="text-xs">${invoice.amount}</div>
          </div>
        </div>
      </div>

      <div className="p-3 flex justify-between items-center">
        <div className="flex flex-wrap gap-2 text-xs">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(invoice)}
            className="px-3 py-1"
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDownload(invoice)}
            className="px-3 py-1 hidden sm:inline-block"
          >
            Download
          </Button>
          {showMarkAsPaid && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onPay(invoice)}
              className="px-3 py-1"
            >
              Mark as Paid
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(invoice)}
              className="px-3 py-1"
            >
              Edit
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-3 py-1">
                More
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-sm">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(invoice)}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(invoice)}>Download</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(invoice)}>Print</DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => onSend(invoice)}>Send</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(invoice)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-red-500">Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
