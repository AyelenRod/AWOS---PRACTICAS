export type Priority = 'Alta' | 'Media' | 'Baja';

export interface Bug {
  id: string;
  description: string;
  priority: Priority;
  createdAt: string;
}
