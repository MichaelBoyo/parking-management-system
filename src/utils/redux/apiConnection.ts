import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ifCondition } from '../functions';

const ApiHeaders = {
  Accept: 'application/json',
};
const baseUrl = 'https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1';
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

export enum STATUS {
  active = 'active',
  inactive = 'inactive',
  pending = 'pending',
}
export enum TIER {
  active = 3,
  inactive = 1,
  pending = 2,
}
type Education = {
  level: string;
  employmentStatus: string;
  sector: string;
  duration: string;
  officeEmail: string;
  monthlyIncome: string[];
  loanRepayment: string;
};
export interface Response {
  createdAt: string;
  orgName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  lastActiveDate: string;
  profile: { [key: string]: string };
  guarantor: { [key: string]: string };
  accountBalance: string;
  accountNumber: string;
  socials: { [key: string]: string };
  education: Education;
  id: string;
  tier: TIER;
}
const createRequest = (url: string, method: any) => ({
  url,
  headers: ApiHeaders,
  method,
});

const apiConnection = createApi({
  reducerPath: 'Api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Get'],

  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => createRequest('/users', 'GET'),
      transformResponse: (response: Response[]) => response.map((user: Response) => ({
        createdAt: user.createdAt,
        orgName: user.orgName,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber
          .trim()
          .replace(/((x|\.))/g, '-')
          .replace(' ', ''),
        id: user.id,
        status: user.createdAt > user.lastActiveDate
          ? STATUS.inactive
          : ifCondition((Date.parse(user.lastActiveDate) - Date.parse(user.createdAt)
            > ONE_YEAR && Date.parse(user.lastActiveDate) - Date.parse(user.createdAt)
            < ONE_YEAR * 3), STATUS.pending, STATUS.active),
      })),
      providesTags: ['Get'],
    }),
    getUser: builder.query({
      query: (id) => createRequest(`/users/${id}`, 'GET'),
      transformResponse: (response: Response) => ({
        ...response,
        phoneNumber: response.phoneNumber
          .replace(/((x|\.|\s))/g, '-')
          .replace(' ', ''),
        guarantor: {
          ...response.guarantor,
          phoneNumber: response.guarantor.phoneNumber
            .trim()
            .replace(/((x|\.))/g, '-')
            .replace(' ', ''),
        },
        tier:
          response.createdAt > response.lastActiveDate
            ? TIER.inactive
            : ifCondition((Date.parse(response.lastActiveDate)
              - Date.parse(response.createdAt)
              > ONE_YEAR
              && Date.parse(response.lastActiveDate)
              - Date.parse(response.createdAt)
              < ONE_YEAR * 3), TIER.pending, TIER.active),
      }),
      providesTags: ['Get'],
    }),
  }),
});
export const { useGetUsersQuery, useGetUserQuery } = apiConnection;
export default apiConnection;
