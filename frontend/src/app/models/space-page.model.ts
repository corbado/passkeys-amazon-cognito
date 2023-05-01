export type SpacePageType = 'content' | 'team' | 'message';

export interface SpacePage {
  feed_id?: number,
  pageID: string,
  name: string,
  title: string,
  type: SpacePageType,
  uuid_users?: string[],
  index?: number,
  icon_link?: string,
}