/* base.c - tinywasm C source
 * Author: spacehen (Dylan Muller)
 */

#include <stdbool.h>
#define NULL 0
#define STR_MAX 255

struct unknown{
    int foo;
    int bar;
};

// Javascript imports.
extern void _print(char * buffer, int size);
extern struct unknown  * _foo(struct unknown);
extern void *malloc(unsigned int bytes);

// Some general std lib functions
int szlen(char * buffer){

    int len = 0;
    char *ptr = buffer;

    while(*ptr++ !=NULL){
        len+=1;
        if(len >=STR_MAX){
            return -1;
        }
    }
    return len;

}
int strlen(const char *str)
{
        const char *s;

        for (s = str; *s; ++s) ;
        return (s - str);
}

 void reverse(char s[])
 {
     int i, j;
     char c;

     for (i = 0, j = strlen(s)-1; i<j; i++, j--) {
         c = s[i];
         s[i] = s[j];
         s[j] = c;
     }
 }

char* itoa(int num, char* str, int base)
{
    int i = 0;
    bool isNegative = false;

    /* Handle 0 explicitly, otherwise empty string is printed for 0 */
    if (num == 0)
    {
        str[i++] = '0';
        str[i] = '\0';
        return str;
    }

    // In standard itoa(), negative numbers are handled only with
    // base 10. Otherwise numbers are considered unsigned.
    if (num < 0 && base == 10)
    {
        isNegative = true;
        num = -num;
    }

    // Process individual digits
    while (num != 0)
    {
        int rem = num % base;
        str[i++] = (rem > 9)? (rem-10) + 'a' : rem + '0';
        num = num/base;
    }

    // If number is negative, append '-'
    if (isNegative)
        str[i++] = '-';

    str[i] = '\0'; // Append string terminator

    // Reverse the string
    reverse(str);

    return str;
}

void print(char * buffer){
    _print(buffer, szlen(buffer));
}

int main(){

    struct unknown object;
    char buffer[10];

    print("Hello World, from C!");
    print("object.foo = 2");
    print("object.bar = 3");

    object.foo = 2;
    object.bar = 3;

    // Parse struct and return
    struct unknown * ret = _foo(object);

    // Convert ret->foo into float
    // using itoa.

    itoa(ret->bar, buffer, 10);

    print("Back to C!");
    // Print return value
    print(buffer);

}