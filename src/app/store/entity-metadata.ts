import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Page: {
  },
  Action: {
  },
  PageAction: {
  },
  InquiryStatus: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  InquirySource: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  ExpenseCategory: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Currency: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  ProductCategory: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Tax: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Unit: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Brand: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Warehouse: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Country: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  City: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
};
const pluralNames = {
  Page: "Pages",
  Action: "Actions",
  PageAction: "PageActions",
  InquiryStatus: "InquiryStatuses",
  InquirySource: "InquirySources",
  ExpenseCategory: "ExpenseCategories",
  Currency: "Currencies",
  ProductCategory: "ProductCategories",
  Tax: "Taxes",
  Unit: "Units",
  Brand: "Brands",
  Warehouse:"Warehouses",
  Country:"Countries",
  City:"Cities"
};

export const entityConfig = {
  entityMetadata,
  pluralNames
};
