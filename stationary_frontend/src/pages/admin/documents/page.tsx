'use client';

import { useState, useEffect } from 'react';
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const mockDocuments: Document[] = [
          {
            id: '1',
            filename: 'thesis_2024.pdf',
            originalName: 'My Thesis Document.pdf',
            fileSize: 2048576, // 2MB
            mimeType: 'application/pdf',
            uploadedBy: {
              email: 'student@example.com',
              firstName: 'John',
              lastName: 'Doe',
            },
            uploadedAt: '2024-03-06T10:30:00Z',
            isPublic: false,
            downloadCount: 5,
          },
          {
            id: '2',
            filename: 'presentation_slides.pptx',
            originalName: 'Q4 Presentation.pptx',
            fileSize: 5242880, // 5MB
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            uploadedBy: {
              email: 'manager@example.com',
              firstName: 'Jane',
              lastName: 'Smith',
            },
            uploadedAt: '2024-03-05T14:20:00Z',
            isPublic: true,
            downloadCount: 23,
          },
          {
            id: '3',
            filename: 'company_logo.png',
            originalName: 'Company Logo.png',
            fileSize: 262144, // 256KB
            mimeType: 'image/png',
            uploadedBy: {
              email: 'designer@example.com',
              firstName: 'Mike',
              lastName: 'Johnson',
            },
            uploadedAt: '2024-03-04T09:15:00Z',
            isPublic: true,
            downloadCount: 45,
          },
          {
            id: '4',
            filename: 'annual_report.zip',
            originalName: 'Annual Report 2024.zip',
            mimeType: 'application/zip',
            fileSize: 15728640, // 15MB
            uploadedBy: {
              email: 'accountant@example.com',
              firstName: 'Sarah',
              lastName: 'Williams',
            },
            uploadedAt: '2024-03-03T16:45:00Z',
            isPublic: false,
            downloadCount: 12,
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocuments(mockDocuments);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'pdf' && doc.mimeType === 'application/pdf') ||
                       (typeFilter === 'image' && doc.mimeType.startsWith('image/')) ||
                       (typeFilter === 'document' && doc.mimeType.includes('document')) ||
                       (typeFilter === 'archive' && doc.mimeType.includes('zip'));
    
    return matchesSearch && matchesType;
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-400" />;
    } else if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-green-400" />;
    } else if (mimeType.includes('zip')) {
      return <FileArchive className="h-4 w-4 text-yellow-400" />;
    } else {
      return <File className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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

  const getVisibilityBadge = (isPublic: boolean) => (
    <Badge className={isPublic ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
      {isPublic ? 'Public' : 'Private'}
    </Badge>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-400" />
            Document Management
          </h1>
          <p className="text-gray-400">Manage all uploaded documents and files</p>
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
              <TableHead className="text-gray-300">File</TableHead>
              <TableHead className="text-gray-300">Uploaded By</TableHead>
              <TableHead className="text-gray-300">Size</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Visibility</TableHead>
              <TableHead className="text-gray-300">Downloads</TableHead>
              <TableHead className="text-gray-300">Upload Date</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id} className="border-gray-700 hover:bg-gray-750">
                <TableCell className="text-gray-100">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.mimeType)}
                    <div>
                      <p className="font-medium">{doc.filename}</p>
                      <p className="text-sm text-gray-400">{doc.originalName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  <div>
                    <p className="font-medium">
                      {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{doc.uploadedBy.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatFileSize(doc.fileSize)}
                </TableCell>
                <TableCell className="text-gray-300">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {doc.mimeType.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>{getVisibilityBadge(doc.isPublic)}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{doc.downloadCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatDate(doc.uploadedAt)}
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
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-blue-400 hover:bg-gray-700 hover:text-blue-400">
                        <FileText className="h-4 w-4 mr-2" />
                        Make Public
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Document
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
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
