import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StageView } from "@/components/dashboard/StageView";
import { allStages, findStageBySlug } from "@/lib/stages";

export function generateStaticParams() {
  return allStages.map((stage) => ({ stage: stage.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { stage: string };
}): Metadata {
  const stage = findStageBySlug(params.stage);
  return { title: stage ? stage.name : "Stage" };
}

export default function StagePage({ params }: { params: { stage: string } }) {
  const stage = findStageBySlug(params.stage);
  if (!stage) notFound();

  return <StageView stage={stage} />;
}
