from django import template
register = template.Library()

FIELD_NAMES = {
    'PasswordInput': 'password',
    'EmailInput': 'email'
}


@register.filter(name='fieldtype', is_safe=True)
def field_type(field):
    name = field.field.widget.__class__.__name__
    return FIELD_NAMES[name] if name in FIELD_NAMES else 'text'
