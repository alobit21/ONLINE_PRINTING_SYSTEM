'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { FileText, Download, Trash2, MoreHorizontal, Eye, File, Image, FileArchive } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/Button';
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
import { Input } from '../../../components/ui/Input';
import { GET_ALL_DOCUMENTS, GET_ME } from '../../../features/admin/api';
import { useAuthStore } from '../../../stores/authStore';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: {
    email: string;
    firstName: string;
    lastName: string;
  };
  uploadedAt: string;
  isPublic: boolean;
  downloadCount: number;
}

export default function AdminDocumentsPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { data: meData, loading: meLoading, error: meError } = useQuery(GET_ME);
  const { data, loading, error } = useQuery(GET_ALL_DOCUMENTS, {
    // Skip the documents query if we're not authenticated or not admin
    skip: !meData?.me || meData?.me?.role !== 'ADMIN'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  if (meLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (meError) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Authentication Error</p>
        <p className="text-sm">{meError.message}</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login Again
        </button>
      </div>
    );
  }

  const currentUser = meData?.me;

  if (!currentUser) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Not Authenticated</p>
        <p className="text-sm">Please login to access this page.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-sm">You don't have admin permissions to view this page.</p>
        <p className="text-sm">Your role: {currentUser.role}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Go Home
        </button>
      </div>
    );
  }
  
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-400" />
            Document Management
          </h1>
          <p className="text-gray-400">Manage all platform documents and files</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {documents.length} documents
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <select 
          value={typeFilter} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="archive">Archives</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">File Name</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Size</TableHead>
              <TableHead className="text-gray-300">Owner</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc: any) => (
              <TableRow key={doc.id} className="border-gray-700 hover:bg-gray-750">
                <TableCell className="text-gray-100 font-medium">
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.fileType)}
                    <div>
                      <p className="font-medium">{doc.fileName}</p>
                      <p className="text-sm text-gray-400">{doc.fileType}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                    {doc.fileType.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatFileSize(doc.fileSize)}
                </TableCell>
                <TableCell className="text-gray-300">
                  <div>
                    <p className="font-medium">
                      {doc.owner?.firstName} {doc.owner?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{doc.owner?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {doc.virusDetected ? (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Virus Detected
                    </Badge>
                  ) : doc.isScanned ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Scanned
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Pending Scan
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-300">
                  {doc.createdAt && formatDate(doc.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-blue-400 hover:bg-gray-700 hover:text-blue-400">
                        Scan for Viruses
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
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
        <div className="text-center py-12 text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm">Documents will appear here when users upload them</p>
        </div>
      )}
    </div>
  );
}
