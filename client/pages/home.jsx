import React from 'react';
import SearchPage from './search-page';
import AppDrawer from '../components/appdrawer';

export default function Home(props) {
  return (
    <>
    <AppDrawer />
    <SearchPage />
    </>
  );
}
