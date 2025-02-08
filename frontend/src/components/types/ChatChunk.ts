export interface ChatChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    service_tier: string;
    system_fingerprint: string;
    choices: {
      index: number;
      delta: {
        role?: string;
        content?: string;
        refusal?: string | null;
      };
      logprobs: null;
      finish_reason: string | null;
    }[];
  }
  