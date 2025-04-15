"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
interface Props {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedUser = JSON.parse(user);
  const router = useRouter();
  const pathname = usePathname();
  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "https://google.com",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname, //why is this path required? answer- this is required to revalidate the path after the user has been updated
      });
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full gap-9 flex-col"
          //flex-col is for flex direction column basically meaning that the children of the flex container will be stacked vertically whereas flex-row is for horizontal stacking(flex-col is for up-down and flex-row is for left-right)
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5 ">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-3.5 ">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your username"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="space-y-3.5 ">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Portfolio Link
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Your portfolio link"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5 ">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where are you from?"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5 ">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Bio <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Profile;
