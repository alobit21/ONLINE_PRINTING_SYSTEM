import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../components/ui/tooltip';

interface DocumentMetadata {
  fileName: string;
  pageCount: number;
  dimensions: string;
  uploadedAt: string;
}

interface ColorAnalysis {
  blackAndWhitePages: number;
  coloredPages: number;
  colorPreviews: string[]; // URLs or base64 thumbnails
}

interface PricingBreakdown {
  basePrice: number;
  colorSurcharge: number;
  descriptionFees: number;
  estimatedTotal: number;
}

interface DocumentAnalysisPanelProps {
  metadata: DocumentMetadata;
  colorAnalysis: ColorAnalysis;
  pricing: PricingBreakdown;
  onEditSettings: () => void;
  onViewPageByPage: () => void;
}

export const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({ metadata, colorAnalysis, pricing, onEditSettings, onViewPageByPage }) => {
  const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Document Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Document Name:</strong> {metadata.fileName}</p>
          <p><strong>Pages:</strong> {metadata.pageCount}</p>
          <p><strong>Size:</strong> {metadata.dimensions}</p>
          <p><strong>Uploaded:</strong> {metadata.uploadedAt}</p>
        </CardContent>
      </Card>

      {/* Color Analysis Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Color Analysis</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewPageByPage}>View Page-by-Page</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked readOnly />
              <span>Black & White Pages: {colorAnalysis.blackAndWhitePages}</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked readOnly />
              <span>Colored Pages: {colorAnalysis.coloredPages}</span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {colorAnalysis.colorPreviews.map((src, idx) => (
              <img key={idx} src={src} alt={`Color preview ${idx + 1}`} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Pricing Breakdown</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Description Fees cover file processing, quality checks, etc.</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Description fees cover file processing, quality checks, and other service-related costs</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <p>Base Price (B&amp;W): ${pricing.basePrice.toFixed(2)}</p>
          <p>Color Pages Surcharge: ${pricing.colorSurcharge.toFixed(2)}</p>
          <p>Description Fees (10%): ${pricing.descriptionFees.toFixed(2)}</p>
          <hr className="my-2" />
          <p><strong>Estimated Total: ${pricing.estimatedTotal.toFixed(2)}</strong></p>
          <Button variant="outline" className="mt-4" onClick={onEditSettings}>Edit Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};
