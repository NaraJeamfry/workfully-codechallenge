-- Storing UUIDs as a BLOB or a string has equal performance, so we'll choose
-- a string for readability: https://stackoverflow.com/a/11337522

CREATE TABLE Account (
    id                  TEXT    PRIMARY KEY,
    balance             REAL    NOT NULL,
    depositedToday      REAL    NOT NULL,
    lastDepositToday    TEXT    NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE Account;