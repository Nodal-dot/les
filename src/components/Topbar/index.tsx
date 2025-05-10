import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import * as React from "react";

export const TopBar = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const items = [
    { title: "Главная", url: "/" },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      return {
        title: name.charAt(0).toUpperCase() + name.slice(1),
        url: routeTo,
      };
    }),
  ];

  return (
    <Flex align="center" p={4} borderBottom="1px" borderColor="inherit">
      <ChakraBreadcrumb.Root>
        <ChakraBreadcrumb.List>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbLink
                      as={Link}
                      href={item.url}
                      fontWeight="semibold"
                      color="inherit"
                      _hover={{ textDecoration: "none" }}
                    >
                      {item.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink as={Link} href={item.url}>
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <ChakraBreadcrumb.Separator />}
              </React.Fragment>
            );
          })}
        </ChakraBreadcrumb.List>
      </ChakraBreadcrumb.Root>
    </Flex>
  );
};

export default TopBar;