export interface ChangeRoleRequest {
  requestid: number;
  username: string;
  motivation: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestDate: Date;
  handledDate: Date | null;
  handledBy: string | null;
  rejectionMotivation: string | null;
}
