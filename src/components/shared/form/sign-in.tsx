import { Link, navigate } from 'gatsby';
import React, { FC, useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import { ApiButton } from '../buttons/api-button';
import { ApiResponse, ErrorResponse, JwtToken } from '@api';
import { useSiteMetadata } from '@hooks';
import {
  FormLabel,
  FormInput,
  LinkWrapper,
  ButtonWrapper,
} from '@components/shared/form/controls';
import { Form } from '@components/shared/form';
import { AuthContext } from '@contexts';

const Wrapper = styled.section`
  background-color: ${({ theme }) => theme.colors.section};

  padding: ${({ theme }) => theme.boxes.padding.section.smallTop};

  @media screen and(max-width: ${({ theme }) => theme.sizes.width.medium}) {
    flex-direction: column;
  }

  @media screen and(max-width: ${({ theme }) => theme.sizes.width.small}) {
    padding: ${({ theme }) => theme.boxes.padding.section.small};
  }
`;

const Error = styled.p`
  color: ${({ theme }) => theme.colors.alert.danger};
  margin-bottom: 0;
`;

interface SignInFormProps {
  location: {
    state: {
      message: string;
    };
  };
}

export const SignInForm: FC<SignInFormProps> = ({ location }) => {
  const siteMetadata = useSiteMetadata();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (location.state !== null) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleClick = async () => {
    if (email === '' || password === '') {
      setMessage('Invalid email or password');
      return;
    }

    try {
      const response = (await authContext.signIn?.({
        email,
        password,
      })) as ApiResponse<JwtToken | ErrorResponse>;

      if (response.ok) {
        navigate('/database');
      } else {
        setMessage((response.data as ErrorResponse).message);
      }
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <Wrapper>
      <Form heading={`Sign In To ${siteMetadata.title}`}>
        {message && <Error>{message}</Error>}
        <FormLabel htmlFor="email-signin">Email</FormLabel>
        <FormInput
          name="email-signin"
          id="email-signin"
          type="email"
          placeholder="unicorn@projectunicorn.net"
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage('');
          }}
        />

        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
          name="password"
          id="password"
          type="password"
          placeholder="Your Password"
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage('');
          }}
        />

        <LinkWrapper>
          <Link to="/signup/">New member? Sign Up!</Link>
        </LinkWrapper>

        <ButtonWrapper>
          <ApiButton handleClick={handleClick} statusText="Signing In...">
            Sign In
          </ApiButton>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
