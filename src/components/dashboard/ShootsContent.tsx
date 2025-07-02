
import React from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, UploadIcon } from 'lucide-react';
import { ShootsList } from './ShootsList';
import { ShootCard } from './ShootCard';
import { Button } from '@/components/ui/button';
import { ShootData } from '@/types/shoots';

interface ShootsContentProps {
  filteredShoots: ShootData[];
  viewMode: 'grid' | 'list';
  onShootSelect: (shoot: ShootData) => void;
  onUploadMedia?: (shoot: ShootData) => void;
  showMedia?: boolean;
}

export function ShootsContent({ 
  filteredShoots, 
  viewMode,
  onShootSelect,
  onUploadMedia,
  showMedia = false
}: ShootsContentProps) {
  if (filteredShoots.length === 0) {
    return (
      <Alert variant="default">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          No shoots found matching the current filters.
        </AlertDescription>
      </Alert>
    );
  }

  if (viewMode === 'list') {
    return (
      <ShootsList 
        shoots={filteredShoots} 
        onSelect={onShootSelect} 
        onUploadMedia={onUploadMedia}
        showMedia={showMedia}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredShoots.map((shoot) => {
        // Show media and upload button for completed shoots
        const shouldShowMedia = shoot.status === 'completed' && showMedia;
        const shouldShowUploadButton = shoot.status === 'completed' && onUploadMedia;
        
        return (
          <Card key={shoot.id} className="overflow-hidden">
            <ShootCard 
              shoot={shoot} 
              onClick={() => onShootSelect(shoot)}
              showMedia={shouldShowMedia}
            />
            {shouldShowUploadButton && (
              <div className="p-3 border-t flex justify-end bg-muted/30">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUploadMedia(shoot);
                  }}
                  className="flex items-center gap-2"
                >
                  <UploadIcon className="h-4 w-4" />
                  Upload Media
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
