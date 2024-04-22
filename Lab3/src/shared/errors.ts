export class UserAlreadyExists extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class AdminAlreadyExists extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class UserNotFound extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class UserDontHaneAnyOrders extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class UnavableAddress extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class WrongType extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class WrongStatusForUpdateUserStatus extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
