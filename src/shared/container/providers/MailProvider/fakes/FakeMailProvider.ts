import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dto/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(data: ISendMailDTO): Promise<void> {
    this.messages.push(data);
  }
}
