import React from "react";
import NotFound from "@/ui/widget/not-found";
import Container from "@/ui/components/container";

const NotFoundPage = () => {
  return (
    <Container as="main">
      <div className="flex items-center justify-center py-[200px]">
        <NotFound label="Search Your Domains" />
      </div>
    </Container>
  );
};

export default NotFoundPage;
