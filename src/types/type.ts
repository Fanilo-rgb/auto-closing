export type workspace = {
  id: string;
  name: string;
  color: string;
}

export type file = {
  workspaceId: string;
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  lastOpenedAt: Date | null;
}

export type product = {
  name: string;
  bv: number;
  price: number | null;
  order: number;
  quantity: number;
}

export type person = {
  name: string;
  numberCard: string;
}

export type application = {
  fileId: string
  consultant: person & {
    phone: string;
    cin: string;
  };
  upLine: person;
  sponsor: person;
}

export type bv = {
  id: string;
  fileId: string
  holder: person
  products: product[]
}

export type itemType = "workspace" | "file"

export type event = "open" | "update"

export type history = {
  originId: string
  name: string
  link:string
  type: itemType
  event: event
  eventDate: Date
}
