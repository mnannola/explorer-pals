-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Trip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EmailToTrip" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EmailToTrip_A_fkey" FOREIGN KEY ("A") REFERENCES "Email" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EmailToTrip_B_fkey" FOREIGN KEY ("B") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmailToTrip_AB_unique" ON "_EmailToTrip"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailToTrip_B_index" ON "_EmailToTrip"("B");

--------------------------------- Manual Seeding --------------------------
-- Hey there, Kent here! This is how you can reliably seed your database with
-- some data. You edit the migration.sql file and that will handle it for you.
INSERT INTO Permission VALUES('cluq8cthu000882i4qb8rsjst','create','trip','own','',1712537071699,1712537071699);
INSERT INTO Permission VALUES('cluq8cthv000982i4400vfh55','create','trip','any','',1712537071700,1712537071700);
INSERT INTO Permission VALUES('cluq8cthw000a82i4yzp9qdyj','read','trip','own','',1712537071701,1712537071701);
INSERT INTO Permission VALUES('cluq8cthy000b82i4mbx9qgch','read','trip','any','',1712537071702,1712537071702);
INSERT INTO Permission VALUES('cluq8cthy000c82i4kd9quaxx','update','trip','own','',1712537071703,1712537071703);
INSERT INTO Permission VALUES('cluq8cthz000d82i4a6pp0ddo','update','trip','any','',1712537071704,1712537071704);
INSERT INTO Permission VALUES('cluq8cti0000e82i414lrsyyt','delete','trip','own','',1712537071705,1712537071705);
INSERT INTO Permission VALUES('cluq8cti1000f82i4q5m6jau1','delete','trip','any','',1712537071706,1712537071706);

-- INSERT INTO Role VALUES('clnf2zvlw000gpcour6dyyuh6','admin','',1696625465540,1696625465540);
-- INSERT INTO Role VALUES('clnf2zvlx000hpcou5dfrbegs','user','',1696625465542,1696625465542);

INSERT INTO _PermissionToRole VALUES('cluq8cthv000982i4400vfh55','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('cluq8cthy000b82i4mbx9qgch','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('cluq8cthz000d82i4a6pp0ddo','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('cluq8cti1000f82i4q5m6jau1','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('cluq8cthu000882i4qb8rsjst','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('cluq8cthw000a82i4yzp9qdyj','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('cluq8cthy000c82i4kd9quaxx','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('cluq8cti0000e82i414lrsyyt','clnf2zvlx000hpcou5dfrbegs');
