export interface CardConfModel {
  size?: { width: string; height: string; };
  urlImg: string;
  class: 'product' | 'link' | 'bundle';
  title: string;
  subtitle?: string;
  tagDesc: string;
  tagColor?: string;
}