import { readFileSync, writeFileSync } from "fs";

const filePath = `src/utility/localfiles/hisab.json`;

interface Hisab {
  userId: string;
  amount: number;
  messageId: string;
  timestamp?: number;
}

export async function AddHisab({ amount, messageId, userId }: Hisab) {
  const data = JSON.parse(
    readFileSync(filePath, { encoding: "utf-8" })
  ) as Hisab[];

  const newData = data.concat();
  newData.push({
    amount,
    messageId,
    userId,
    timestamp: Date.now(),
  });

  writeFileSync(filePath, JSON.stringify(newData, null, 2));
  return {
    oldData: data,
    newData,
  };
}

export async function TotalHisab() {
  const data = JSON.parse(
    readFileSync(filePath, { encoding: "utf-8" })
  ) as Hisab[];

  return data;
}

export async function ClearHisab() {
  writeFileSync(filePath, JSON.stringify([], null, 2));
}
