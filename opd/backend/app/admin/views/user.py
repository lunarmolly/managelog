
from sqladmin import ModelView

from ...db.models import UserOrm

class UserView(ModelView, model=UserOrm):
    column_list = [
        UserOrm.id,
        UserOrm.login,
        UserOrm.email,
    ]

    column_details_list = [
        UserOrm.id,
        UserOrm.login,
        UserOrm.email,
    ]

    column_labels = {
        UserOrm.id: "User ID",
        UserOrm.login: "Login",
        UserOrm.email: "Email",
    }  

    column_searchable_list = [
        UserOrm.login,
        UserOrm.email
    ]

    form_excluded_columns = [
        UserOrm.password_hash
    ]
    
    can_delete = True
    can_create = True
    can_edit = True
    can_view_details = True

    icon = 'fa fa-user'
    name = "User"
    name_plural = "Users"