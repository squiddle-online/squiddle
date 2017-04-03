from django import template
register = template.Library()

FIELD_NAMES = {
    'PasswordInput': 'password',
    'EmailInput': 'email'
}


@register.filter(is_safe=True)
def field_type(field):
    name = field.field.widget.__class__.__name__
    return FIELD_NAMES[name] if name in FIELD_NAMES else 'text'


@register.filter(is_safe=True)
def widget_type(widget):
    return widget.__class__.__name__
