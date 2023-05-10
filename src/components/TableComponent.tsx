import React, {FC, useMemo, useState} from 'react';
//import {TableContainer, Table, TableHead, TableBody, Paper, TableRow, TableCell, Avatar} from '@mui/material'
import {Box, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
//import moment from 'moment';
import {IUser} from "../types/IUser";
import ProfileImage from "./UI/ProfileImage";
import {Size} from "../types/Size";
import consts from "../consts";
import {ReactComponent as Save} from './assets/save-icon.svg'
import global from './style/Global.module.css'
import UserService from "../services/UserService";
interface Props{
    users: IUser[]
}
const TableComponent:FC<Props> = (props) => {

    const [pageSize, setPageSize] = useState(5);
    const [rowId, setRowId] = useState(null);
    const save = (userId:number, role:string, status:string)=>{
        UserService.SaveRoleStatusChanges(userId, role, status)
    }
    const columns = useMemo(
        () => [
            {
                field: 'profileImage',
                headerName: 'Изображение профиля',
                width: 60,
                // @ts-ignore
                renderCell: (params) => <ProfileImage src={consts.API_URL+ params.row.profileImage} size={Size.small} />,
                sortable: false,
                filterable: false,
            },
            { field: 'name', headerName: 'Имя', width: 170 },
            { field: 'surname', headerName: 'Фамилия', width: 170 },
            { field: 'email', headerName: 'Email', width: 200 },
            {
                field: 'role',
                headerName: 'Роль',
                width: 100,
                type: 'singleSelect',
                valueOptions: ['ADMIN', 'USER'],
                editable: true,
            },
            {
                field: 'status',
                headerName: 'Статус',
                width: 100,
                type: 'singleSelect',
                valueOptions: ['NORMAL', 'BANNED'],
                editable: true,
            },
            {
                field: 'statusFrom',
                headerName: 'Дата получения статуса',
                width: 100,
                type: 'singleSelect',
                // @ts-ignore
                renderCell: (params) => <div>
                    {params.row.statusFrom.getFullYear()}.
                    {params.row.statusFrom.getMonth()+1}.
                    {params.row.statusFrom.getDate()}</div>,
            },
            {
                field: 'actions',
                headerName: 'Сохранить',
                type: 'actions',
                // @ts-ignore
                renderCell: (params) => (
                    <div
                        className={global.button}
                        onClick={()=>{save(params.row.userId,params.row.role,params.row.status)}}
                        style={{transform:"translateY(-25%)"}}
                    >
                        <Save className={global.comment}/>
                    </div>
                ),
            },
        ],
        [rowId]
    );
    return (
        <Box
            sx={{
                height: 400,
                width: '100%',
            }}
        >
            <DataGrid
                columns={columns}
                rows={props.users}
                getRowId={(row) => row.userId}
                // @ts-ignore
                rowsPerPageOptions={[5, 10, 20]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize:number) => setPageSize(newPageSize)}
                getRowSpacing={(params) => ({
                    top: params.isFirstVisible ? 0 : 5,
                    bottom: params.isLastVisible ? 0 : 5,
                })}
                /*sx={{
                    [`& .${gridClasses.row}`]: {
                        bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? grey[200] : grey[900],
                    },
                }}*/
                // @ts-ignore
                onCellEditCommit={(params) => setRowId(params.id)}
            />
        </Box>
    );
};

export default TableComponent;
