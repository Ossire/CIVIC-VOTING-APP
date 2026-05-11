export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  endsAt: Date; // The deadline
  createdAt: Date;
  userHasVoted?: boolean;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}
