-- CreateTable
CREATE TABLE "users" (
    "walletAddress" VARCHAR(42) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateTable
CREATE TABLE "rounds" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL,
    "questName" VARCHAR(100),
    "questType" VARCHAR(50) DEFAULT 'BRONZE',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "poolWei" VARCHAR(78) NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "isSealed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(42) NOT NULL,
    "roundId" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "grossWei" VARCHAR(78) NOT NULL,
    "netWei" VARCHAR(78) NOT NULL,
    "feeWei" VARCHAR(78) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "winners" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "userId" VARCHAR(42) NOT NULL,
    "prizeWei" VARCHAR(78) NOT NULL,
    "rank" SMALLINT NOT NULL,
    "questType" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "winners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nonces" (
    "walletAddress" VARCHAR(42) NOT NULL,
    "nonce" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nonces_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "rounds_roundId_key" ON "rounds"("roundId");

-- CreateIndex
CREATE INDEX "rounds_status_idx" ON "rounds"("status");

-- CreateIndex
CREATE INDEX "rounds_roundId_idx" ON "rounds"("roundId");

-- CreateIndex
CREATE INDEX "rounds_questType_idx" ON "rounds"("questType");

-- CreateIndex
CREATE INDEX "rounds_chainId_idx" ON "rounds"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "participations_txHash_key" ON "participations"("txHash");

-- CreateIndex
CREATE INDEX "participations_userId_idx" ON "participations"("userId");

-- CreateIndex
CREATE INDEX "participations_roundId_idx" ON "participations"("roundId");

-- CreateIndex
CREATE INDEX "participations_txHash_idx" ON "participations"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "participations_userId_roundId_key" ON "participations"("userId", "roundId");

-- CreateIndex
CREATE INDEX "winners_roundId_idx" ON "winners"("roundId");

-- CreateIndex
CREATE INDEX "winners_userId_idx" ON "winners"("userId");

-- CreateIndex
CREATE INDEX "winners_questType_idx" ON "winners"("questType");

-- CreateIndex
CREATE INDEX "winners_userId_questType_idx" ON "winners"("userId", "questType");

-- CreateIndex
CREATE INDEX "nonces_expiresAt_idx" ON "nonces"("expiresAt");

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nonces" ADD CONSTRAINT "nonces_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
