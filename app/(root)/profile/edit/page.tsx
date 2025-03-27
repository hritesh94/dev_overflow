import Profile from "@/components/forms/Profile";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async ({ params }: ParamsProps) => {
  const { userId } = await auth();

  if (!userId) return null;

  const mongoUserId = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile
        
          clerkId={userId}
          user={JSON.stringify(mongoUserId)}
          // we have to stringify before sending the user because it is a complex object of mongoDb and we cant pass it from server to client component directly this is why we stringify it
        />
      </div>
    </>
  );
};

export default page;
