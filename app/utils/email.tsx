import * as React from 'react';

import { Tailwind, Section, Row, Button, Text } from "@react-email/components";


export function Email(magicLink) {
  const { url } = magicLink;

  return(
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {},
          },
        },
      }}
    >
      <Section>
        <Row className="bg-amber-200">
          <Text className="text-center text-4xl font-black bg-amber-200 text-white py-6">Tales and Pages</Text> 
        </Row>
        <Row className="bg-sky-300 text-center">
          <Text className="text-center text-white py-4">
            We heard you wanted to login. So we have sent you a link.
          </Text>
          <Button className="w-full max-w-xs mb-10 text-center rounded py-4 text-sky-300 font-black bg-white" href={url}>
            Login
          </Button>
        </Row>
      </Section>
    </Tailwind>
  );
}

export default Email;
