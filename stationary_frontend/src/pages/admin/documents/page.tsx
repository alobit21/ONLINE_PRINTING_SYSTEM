'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FileText, Download, Trash2, MoreHorizontal, Eye, File, Image, FileArchive, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/LegacyButton';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/LegacyInput';
import { GET_ALL_DOCUMENTS } from '../../../features/admin/api';

export default function AdminDocumentsPage() {
  const { data, loading, error } = useQuery(GET_ALL_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const documents = data?.documents?.data || [];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.owner?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'pdf' && doc.fileType === 'application/pdf') ||
                       (typeFilter === 'image' && doc.fileType.startsWith('image/')) ||
                       (typeFilter === 'document' && doc.fileType.includes('document')) ||
                       (typeFilter === 'archive' && doc.fileType.includes('zip'));
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) return <FileArchive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getVisibilityBadge = (isPublic: boolean) => (
    <Badge className={isPublic ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
      {isPublic ? 'Public' : 'Private'}
    </Badge>
  );

  const totalDocuments = documents.length;
  const safeDocuments = documents.filter((d: any) => d.isScanned && !d.virusDetected).length;
  const pendingScan = documents.filter((d: any) => !d.isScanned).length;
  const totalSize = documents.reduce((acc: number, curr: any) => acc + (curr.fileSize || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1 flex items-center gap-3">
            <FileText className="h-7 w-7 text-hp-primary" />
            Document Management
          </h1>
          <p className="text-steel text-sm">Manage all platform documents and files</p>
        </div>
        <div className="text-sm font-medium text-steel bg-cloud border border-fog px-4 py-2 rounded-lg">
          Total: {totalDocuments} documents
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-hp-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-hp-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Total Files</p>
            <p className="text-2xl font-bold text-ink leading-tight">{totalDocuments}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Safe & Scanned</p>
            <p className="text-2xl font-bold text-ink leading-tight">{safeDocuments}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Pending Scan</p>
            <p className="text-2xl font-bold text-ink leading-tight">{pendingScan}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Database className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Storage Used</p>
            <p className="text-xl font-bold text-ink leading-tight">{formatFileSize(totalSize)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main / Centered Content */}
        <div className="xl:col-span-3 space-y-6">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-cloud border-fog text-ink placeholder-steel focus-visible:ring-hp-primary"
          />
        </div>
        <select 
          value={typeFilter} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
          className="bg-cloud border border-fog text-ink rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-hp-primary focus:border-hp-primary"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="archive">Archives</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="bg-cloud border border-fog rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-fog bg-paper">
              <TableHead className="text-graphite font-semibold">File Name</TableHead>
              <TableHead className="text-graphite font-semibold">Type</TableHead>
              <TableHead className="text-graphite font-semibold">Size</TableHead>
              <TableHead className="text-graphite font-semibold">Owner</TableHead>
              <TableHead className="text-graphite font-semibold">Status</TableHead>
              <TableHead className="text-graphite font-semibold">Date</TableHead>
              <TableHead className="text-graphite font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc: any) => (
              <TableRow key={doc.id} className="border-fog hover:bg-paper/50 transition-colors">
                <TableCell className="text-ink font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-hp-primary/10 flex items-center justify-center text-hp-primary shrink-0">
                        {getFileIcon(doc.fileType)}
                    </div>
                    <div>
                      <p className="font-medium text-ink truncate max-w-[200px]">{doc.fileName}</p>
                      <p className="text-xs text-graphite truncate max-w-[200px]">{doc.fileType}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-steel">
                  <Badge className="bg-cloud text-steel border-fog">
                    {doc.fileType.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-steel font-medium">
                  {formatFileSize(doc.fileSize)}
                </TableCell>
                <TableCell className="text-steel">
                  <div>
                    <p className="font-medium text-ink">
                      {doc.owner?.firstName} {doc.owner?.lastName}
                    </p>
                    <p className="text-xs text-graphite">{doc.owner?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-steel">
                  {doc.virusDetected ? (
                    <Badge className="bg-error/10 text-error border-error/20">
                      Virus Detected
                    </Badge>
                  ) : doc.isScanned ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      Scanned
                    </Badge>
                  ) : (
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      Pending Scan
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-steel">
                  {doc.createdAt && formatDate(doc.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-steel hover:text-ink hover:bg-cloud border border-transparent hover:border-fog">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-canvas border-fog shadow-lg">
                      <DropdownMenuLabel className="text-ink">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-fog" />
                      <DropdownMenuItem className="text-ink hover:bg-cloud cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-ink hover:bg-cloud cursor-pointer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-fog" />
                      <DropdownMenuItem className="text-info hover:bg-info/10 cursor-pointer focus:bg-info/10 focus:text-info">
                        Scan for Viruses
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-error hover:bg-error/10 cursor-pointer focus:bg-error/10 focus:text-error">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

          {filteredDocuments.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-fog rounded-xl">
              <FileText className="h-12 w-12 mx-auto mb-3 text-steel opacity-50" />
              <p className="text-lg font-medium text-ink">No documents found</p>
              <p className="text-sm text-steel mt-1">Documents will appear here when users upload them</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-start gap-2 bg-hp-primary hover:bg-hp-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <ShieldAlert className="h-4 w-4" />
                Scan All Pending
              </button>
              <button className="w-full flex items-center justify-start gap-2 border border-fog hover:bg-paper text-ink px-4 py-2 rounded-lg font-medium transition-colors">
                <Trash2 className="h-4 w-4 text-error" />
                Clear Infected Files
              </button>
            </div>
          </div>

          {/* Storage Summary */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Storage Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Scan Coverage</span>
                  <span className="font-medium text-ink">
                    {totalDocuments > 0 ? Math.round(((totalDocuments - pendingScan) / totalDocuments) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${totalDocuments > 0 ? ((totalDocuments - pendingScan) / totalDocuments) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Malware Detected</span>
                  <span className="font-medium text-error">
                    {totalDocuments > 0 ? Math.round(((totalDocuments - safeDocuments - pendingScan) / totalDocuments) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-error h-2 rounded-full" 
                    style={{ width: `${totalDocuments > 0 ? ((totalDocuments - safeDocuments - pendingScan) / totalDocuments) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
