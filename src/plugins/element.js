import Vue from 'vue'
import {
    Button,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Tooltip,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Loading,
    DatePicker,
    Row,
    Col,
    Select,
    Option,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Tag,
    Checkbox,
    CheckboxButton,
    Form,
    FormItem,
    Input,
    Autocomplete,
    Pagination
} from 'element-ui'

const comps = [
    Button,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Tooltip,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Loading,
    DatePicker,
    Row,
    Col,
    Select,
    Option,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Tag,
    Checkbox,
    CheckboxButton,
    Form,
    FormItem,
    Input,
    Autocomplete,
    Pagination
]

comps.forEach(item => Vue.use(item))
