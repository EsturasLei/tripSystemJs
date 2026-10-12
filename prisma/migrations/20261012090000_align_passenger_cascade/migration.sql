-- Align the Passenger foreign key with the intended Prisma schema.
ALTER TABLE "Passenger"
DROP CONSTRAINT "Passenger_tripRequestId_fkey";

ALTER TABLE "Passenger"
ADD CONSTRAINT "Passenger_tripRequestId_fkey"
FOREIGN KEY ("tripRequestId")
REFERENCES "TripRequest"(id)
ON DELETE CASCADE
ON UPDATE CASCADE;