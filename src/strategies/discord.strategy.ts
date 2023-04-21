import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Subscription } from 'rxjs';
import { EmbedBuilder } from 'discord.js';
import { BaseStrategy } from './base.strategy';
import { DiscordConfig, IDiscordBody } from '../interfaces';

@Injectable()
export class DiscordBaseStrategy extends BaseStrategy {
  @Inject()
  private httpService: HttpService;

  @Inject(EmbedBuilder.name)
  embedBuilder: EmbedBuilder;

  constructor(@Optional() discordConfig?: DiscordConfig) {
    super();
    if (discordConfig) this.config = discordConfig;
  }

  send(discordBody: IDiscordBody): Subscription {
    return this.httpService
      .post(this.config.webHookUrl, discordBody)
      .subscribe();
  }

  private mention(mentionList: Array<'here' | 'everyone' | string>): string {
    return mentionList
      .map((person) =>
        person === 'here' || person === 'everyone'
          ? `@${person}`
          : `<@${person}>`,
      )
      .join(', ');
  }
  withHostMessageFormat(): IDiscordBody {
    const embed = this.embedBuilder
      .setColor(0xff0000)
      .setTitle(this.exception.name)
      .setFields(
        {
          name: 'Occurred In',
          value: this.fileName || 'ExceptionHandler',
        },
        {
          name: 'Route',
          value: this.request.path,
          inline: true,
        },
        {
          name: 'Http Method',
          value: this.request.method,
          inline: true,
        },
        {
          name: 'Trace',
          value: this.exception?.stack.slice(0, 1020) + '...',
        },
      )
      .setTimestamp()
      .setFooter({
        text: 'Happened At ',
        iconURL: 'https://i.imgur.com/AfFp7pu.png',
      });
    if (this.exception.uuid)
      embed.addFields({ name: 'Tracking Id', value: this.exception.uuid });
    const discordBody: IDiscordBody = {
      embeds: [embed],
    };
    if (this.config.mentionList && this.config.mentionList.length)
      discordBody.content = this.mention(this.config.mentionList);
    return discordBody;
  }

  simpleMessageFormat(): IDiscordBody {
    /**
     * @see {@link https://discordjs.guide/popular-topics/embeds.html#embed-preview}
     * **/
    const embed = this.embedBuilder
      .setColor(0xff0000)
      .setTitle(this.exception.name)
      .setFields(
        {
          name: 'Occurred In',
          value: this.fileName || 'ExceptionHandler',
        },
        {
          name: 'Trace',
          value: this.exception?.stack.slice(0, 1020) + '...',
        },
      )
      .setTimestamp()
      .setFooter({
        text: 'Happened At ',
        iconURL: 'https://i.imgur.com/AfFp7pu.png',
      });
    if (this.exception.uuid)
      embed.addFields({ name: 'Tracking Id', value: this.exception.uuid });
    const discordBody: IDiscordBody = {
      embeds: [embed],
    };
    if (this.config.mentionList && this.config.mentionList.length)
      discordBody.content = this.mention(this.config.mentionList);
    return discordBody;
  }
}
