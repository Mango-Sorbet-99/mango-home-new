import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBlog extends Struct.ComponentSchema {
  collectionName: 'components_shared_blogs';
  info: {
    displayName: 'Blog';
  };
  attributes: {
    conclusion: Schema.Attribute.Text;
    Date: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    introduction: Schema.Attribute.Text;
    largeSection: Schema.Attribute.Component<'shared.section', true>;
    section: Schema.Attribute.Component<'shared.section', true>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedEmail extends Struct.ComponentSchema {
  collectionName: 'components_shared_emails';
  info: {
    displayName: 'email';
  };
  attributes: {
    email: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    displayName: 'faq';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
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

export interface SharedProjectDirect extends Struct.ComponentSchema {
  collectionName: 'components_shared_project_directs';
  info: {
    displayName: 'Project Direct';
  };
  attributes: {
    catagories: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    Title: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Section';
  };
  attributes: {
    body: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedTerms extends Struct.ComponentSchema {
  collectionName: 'components_shared_terms';
  info: {
    displayName: 'terms';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    displayName: 'testimonials';
  };
  attributes: {
    name: Schema.Attribute.String;
    testimonial: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.blog': SharedBlog;
      'shared.email': SharedEmail;
      'shared.faq': SharedFaq;
      'shared.footer': SharedFooter;
      'shared.link': SharedLink;
      'shared.logo': SharedLogo;
      'shared.navigation': SharedNavigation;
      'shared.other-menus': SharedOtherMenus;
      'shared.project-direct': SharedProjectDirect;
      'shared.section': SharedSection;
      'shared.terms': SharedTerms;
      'shared.testimonials': SharedTestimonials;
    }
  }
}
