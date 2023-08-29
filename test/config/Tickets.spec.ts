import { assert } from "chai";

import { TicketSupportRole } from "../../src/config/Tickets";

const idRegex = /^\d{18,19}$/;

suite("TicketSupportRole", () => {
  test("is a Discord ID", () => {
    assert.match(TicketSupportRole, idRegex);
  });
});
