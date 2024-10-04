export interface SendEmail {
  suppliers?: Array<string>;
  customers?: Array<string>;
  subject: string;
  message: string;
}
