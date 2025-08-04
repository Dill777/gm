"use server";
import prisma from "@/lib/db";
import { CategoryKey } from "@/ui/views/search/category-view";

export const fetchDomainCategories = async () => {
  const categories = await prisma.domainCategory.findMany();
  return categories;
};

export const updateDomainCategories = async (data: {
  [prop: string]: number;
}) => {
  // data : {[prop: CategoryKey]: [taken: number]}
  try {
    const keys = Object.keys(data);
    for (const _key of keys) {
      const { key, taken } = {
        key: _key as CategoryKey,
        taken: data[_key] as number,
      };
      if (!key || !taken) {
        throw "invalid data request";
      }
      const category = await prisma.domainCategory.findUnique({
        where: { key },
      });

      if (!category) {
        const newCategory = await prisma.domainCategory.create({
          data: { key, taken },
        });
        return newCategory;
      }

      await prisma.domainCategory.update({
        where: { id: category.id },
        data: { taken: { increment: taken } },
      });
    }
    return {
      isError: false,
      error: null,
      data: [],
    };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};
