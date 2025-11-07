import type { Schema, Struct } from '@strapi/strapi';

export interface SharedEmail extends Struct.ComponentSchema {
  collectionName: 'components_shared_emails';
  info: {
    displayName: 'email';
  };
  attributes: {
    email: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface SharedFooter extends Struct.ComponentSchema {
  collectionName: 'components_shared_footers';
  info: {
    displayName: 'footer';
  };
  attributes: {
    menus: Schema.Attribute.Component<'shared.other-menus', true>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.String & Schema.Attribute.DefaultTo<'false'>;
    label: Schema.Attribute.String;
  };
}

export interface SharedLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_logos';
  info: {
    displayName: 'logo';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    menuItems: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedNavigation extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigations';
  info: {
    displayName: 'navigation';
  };
  attributes: {
    logo: Schema.Attribute.Component<'shared.logo', false>;
  };
}

export interface SharedOtherMenus extends Struct.ComponentSchema {
  collectionName: 'components_shared_other_menus';
  info: {
    displayName: 'otherMenus';
  };
  attributes: {
    title: Schema.Attribute.String;
    urls: Schema.Attribute.Component<'shared.link', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.email': SharedEmail;
      'shared.footer': SharedFooter;
      'shared.link': SharedLink;
      'shared.logo': SharedLogo;
      'shared.navigation': SharedNavigation;
      'shared.other-menus': SharedOtherMenus;
    }
  }
}
