export type ChatResponse = {
  data?: IAnswer[];
};

export enum MessageType {
  me = 'me',
  them = 'them'
}

export interface IAnswer {
  answer: string;
  article: string;
  title: string;
  score: number;
  entry: number;
  entry_ends: number;
  type?: 'file';
  file?: string;
  file_text?: string;
}

export type IMessage =
  | {
      type: MessageType.me;
      text: string;
    }
  | {
      type: MessageType.them;
      text?: string;
      data?: IAnswer[];
      hints?: string[];
      active: number;
    };
