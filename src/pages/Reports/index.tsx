import React, { useEffect } from 'react';
import { Box, Heading, Spinner, Table } from '@chakra-ui/react';
import { useAppDispatch,useAppSelector } from '../../store/index';
import { fetchReportsAction } from '../../store/reportsSliсe';

const ReportsPage = () => {
   const dispatch = useAppDispatch();
  const { reports, loading } = useAppSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReportsAction());
  }, [dispatch]);

  if (loading) {
    return (
      <Box p={6} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }
  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>Отчеты</Heading>
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Пользователь</Table.ColumnHeader>
            <Table.ColumnHeader>Датчик</Table.ColumnHeader>
            <Table.ColumnHeader>Тип отчета</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {reports.map(report => (
            <Table.Row key={report.id}>
              <Table.Cell>{report.id}</Table.Cell>
              <Table.Cell>{report.username}</Table.Cell>
              <Table.Cell>{report.sensorId}</Table.Cell>
              <Table.Cell>{report.reportType}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default ReportsPage;
