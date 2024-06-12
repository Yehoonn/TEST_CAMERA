/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

const GET = {
  HELLO: gql`
    query GetHello {
      hello
    }
  `,
  TEST: gql`
    query GetTest {
      test {
        id
        name
      }
    }
  `,
  humans: gql`
    query GetTest {
      humans {
        name
        age
      }
    }
  `,
};

const POST = {
  createHuman: gql`
    mutation CreateHuman($name: String!, $age: Int!) {
      addHuman(name: $name, age: $age) {
        name
        age
      }
    }
  `,
};

export { GET, POST };
